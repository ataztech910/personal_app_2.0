import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack(config: Configuration) {
    // Loop through rules to find sass-loader
    config.module?.rules?.forEach((rule) => {
      if (
        typeof rule !== "string" &&
        rule &&
        "oneOf" in rule &&
        Array.isArray(rule.oneOf)
      ) {
        rule.oneOf.forEach((r) => {
          if (r && typeof r !== "string" && Array.isArray(r.use)) {
            r.use.forEach((u) => {
              if (typeof u !== "string" && u.loader?.includes("sass-loader")) {
                u.options = {
                  ...u.options,
                  sassOptions: {
                    ...(u.options?.sassOptions || {}),
                    quietDeps: true, // ✅ Add the quietDeps flag here
                  },
                };
              }
            });
          }
        });
      }
    });

    return config;
  },
};

export default nextConfig;
