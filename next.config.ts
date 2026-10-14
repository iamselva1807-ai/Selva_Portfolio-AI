import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The standalone /resume page was retired in favour of a single header
      // action that opens the PDF. Keep old links working.
      {
        source: "/resume",
        destination: "/Selvakumar_Manoharan_resume.pdf",
        permanent: true,
      },
      // NOTE: do not add a redirect from the old capitalised
      // "/Selvakumar_Manoharan_Resume.pdf". Next matches redirect sources
      // case-insensitively by default (caseSensitiveRoutes: false), so that rule
      // also matches the lowercase destination and 308s to itself forever —
      // verified: the resume became unreachable.
    ];
  },
};

export default nextConfig;
