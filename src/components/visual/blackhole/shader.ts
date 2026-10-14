/**
 * Gravitationally-lensed accretion disk, ray-traced per pixel.
 *
 * Photons are integrated through Schwarzschild spacetime using the Cartesian
 * form of the null-geodesic (Binet) equation:
 *
 *     d²x/dλ² = -(3/2) h² x / r⁵,   h = |x × dx/dλ|  (conserved)
 *
 * in units where the Schwarzschild radius r_s = 1 (M = 1/2). This is exact for
 * Schwarzschild light paths, so the shadow (≈2.6 r_s), the photon sphere
 * (1.5 r_s) and the far side of the disk bending over and under the shadow all
 * fall out of the integration rather than being drawn.
 *
 * The disk is a thin Keplerian disk from the ISCO (3 r_s) outward. Its gas is
 * relativistically Doppler-beamed and gravitationally redshifted, so the side
 * orbiting toward the camera is brighter and hotter. Colour follows the site's
 * palette: white-hot → cyan → violet as the disk cools.
 *
 * Transparent wherever light escapes, so the page's own star field shows
 * through around the black hole.
 */

export const VERTEX = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const FRAGMENT = `#version 300 es
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uLook;     // pointer offset, -1..1, smoothed on the CPU
uniform float uSteps;    // integration budget (quality tier)

out vec4 fragColor;

const float M     = 0.5;   // r_s = 2M = 1
const float R_IN  = 3.0;   // innermost stable circular orbit (6M)
const float R_OUT = 13.0;

float hash21(vec2 p) {
  p = fract(p * vec2(233.34, 851.73));
  p += dot(p, p + 23.45);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { s += a * vnoise(p); p = p * 2.02 + 17.0; a *= 0.5; }
  return s;
}

// The site palette as a temperature ramp:
// violet-abyss → violet-deep → signal-deep → signal → signal-pale → white
vec3 ramp(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 c0 = vec3(0.102, 0.090, 0.204);
  vec3 c1 = vec3(0.290, 0.263, 0.627);
  vec3 c2 = vec3(0.078, 0.459, 0.549);
  vec3 c3 = vec3(0.208, 0.784, 0.910);
  vec3 c4 = vec3(0.796, 0.949, 0.980);
  vec3 c5 = vec3(1.0);
  if (t < 0.2) return mix(c0, c1, t / 0.2);
  if (t < 0.4) return mix(c1, c2, (t - 0.2) / 0.2);
  if (t < 0.6) return mix(c2, c3, (t - 0.4) / 0.2);
  if (t < 0.8) return mix(c3, c4, (t - 0.6) / 0.2);
  return mix(c4, c5, (t - 0.8) / 0.2);
}

// Emission from the disk where a ray crosses it. Returns premultiplied
// colour in rgb and coverage in a.
vec4 disk(vec3 p, vec3 dir, float r) {
  // Keplerian orbital velocity (units of c) and the relativistic Doppler factor
  // for a photon leaving toward the camera (opposite the traced direction).
  vec3  tangent = normalize(vec3(-p.z, 0.0, p.x));
  float v       = sqrt(M / r);
  float gamma   = inversesqrt(1.0 - v * v);
  float dop     = 1.0 / (gamma * (1.0 - dot(v * tangent, -dir)));
  float grav    = sqrt(max(1.0 - 1.0 / r, 1e-3));   // gravitational redshift
  float g       = dop * grav;

  // Thin-disk emissivity shape x^-3 (1 - x^-1/2): zero at the ISCO, peaking
  // just outside it (r ≈ 4.1) and falling away. 0.0567 normalises the peak.
  float x    = r / R_IN;
  float emis = pow(x, -3.0) * max(1.0 - inversesqrt(x), 0.0) / 0.0567;

  // Differential rotation of the turbulence: inner gas laps the outer gas.
  // Slowed far below physical rates — calm, not frantic.
  float phi   = atan(p.z, p.x);
  float omega = sqrt(M / (r * r * r));
  float ang   = phi - omega * uTime * 0.9;
  vec2  ring  = vec2(cos(ang), sin(ang));             // seamless around the orbit

  // Three scales of structure: broad bands, orbiting clumps, and fine
  // concentric striations — the latter give the disk its filmic texture.
  float bands  = fbm(vec2(r * 3.2, 3.7));
  float clumps = fbm(ring * (1.5 + r * 0.35) + vec2(r * 0.9, 0.0));
  float streak = fbm(vec2(r * 13.0, 0.0) + ring * 0.8);
  float turb   = 0.30 + 0.70 * (0.38 * bands + 0.30 * clumps + 0.32 * streak);
  turb         = pow(turb, 1.4) * 1.3;                 // lift contrast

  float I    = emis * turb * pow(g, 3.0);             // beamed intensity
  float temp = clamp(0.18 + 0.62 * emis, 0.0, 1.0) * clamp(g, 0.4, 1.6);
  float edge = smoothstep(R_IN * 0.96, R_IN * 1.15, r)
             * (1.0 - smoothstep(R_OUT * 0.55, R_OUT, r));

  vec3  col = ramp(temp) * I * 1.6 * edge;
  float a   = clamp(I * 1.2, 0.0, 0.95) * edge;
  return vec4(col, a);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

  // Camera just above the disk plane — nearly edge-on, the angle that makes
  // the far side of the disk arc over and under the shadow.
  float D    = 24.0;
  float incl = radians(84.5) - uLook.y * radians(2.5);
  float az   = uLook.x * radians(5.0);
  vec3  cam  = D * vec3(sin(incl) * sin(az), cos(incl), -sin(incl) * cos(az));
  vec3  fw   = normalize(-cam);
  vec3  rt   = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
  vec3  up   = cross(fw, rt);

  vec3 pos = cam;
  vec3 vel = normalize(fw * 1.35 + uv.x * rt + uv.y * up);
  vec3 hv  = cross(pos, vel);
  float h2 = dot(hv, hv);

  vec3  col   = vec3(0.0);
  float alpha = 0.0;
  float rmin  = 1e9;
  float glow  = 0.0;

  for (int i = 0; i < 160; i++) {
    if (float(i) >= uSteps) break;
    float r = length(pos);
    rmin = min(rmin, r);
    if (r < 1.0) { alpha = 1.0; break; }               // crossed the horizon

    float dt   = clamp(0.055 * r, 0.015, 1.2);         // finer steps near the hole
    vec3  prev = pos;
    vel += (-1.5 * h2 * pos / pow(r, 5.0)) * dt;
    pos += vel * dt;

    // Faint volumetric halo hugging the disk plane — reads as bloom.
    float rr = length(pos.xz);
    if (rr > R_IN * 0.9 && rr < R_OUT * 1.2) {
      glow += exp(-abs(pos.y) * 3.0) * pow(rr / R_IN, -2.0) * dt * 0.018;
    }

    // Disk-plane crossing: composite front to back.
    if (prev.y * pos.y < 0.0) {
      vec3  hit = mix(prev, pos, prev.y / (prev.y - pos.y));
      float rc  = length(hit.xz);
      if (rc > R_IN * 0.95 && rc < R_OUT) {
        vec4 d = disk(hit, normalize(vel), rc);
        col   += (1.0 - alpha) * d.rgb;
        alpha += (1.0 - alpha) * d.a;
        if (alpha > 0.985) break;
      }
    }

    if (r > 60.0 && dot(pos, vel) > 0.0) break;        // escaped to infinity
  }

  // Photon ring: light that skimmed the photon sphere at r = 1.5 r_s.
  float ring = exp(-pow(max(rmin - 1.5, 0.0) * 5.0, 1.3)) * step(1.0, rmin);
  col   += (1.0 - alpha) * (ramp(0.86) * ring * 0.55 + ramp(0.62) * glow);
  alpha += (1.0 - alpha) * clamp(ring * 0.55 + glow, 0.0, 1.0) * 0.85;

  col = vec3(1.0) - exp(-col * 1.25);                  // soft tone map
  // Keep the output valid premultiplied alpha (rgb ≤ a). Over the near-black
  // page this is visually identical to additive glow.
  alpha = max(alpha, max(max(col.r, col.g), col.b));
  fragColor = vec4(col, alpha);
}
`;
