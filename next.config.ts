import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // experimental: {
  //   mdxRs: {
  //     jsxRuntime: string            // Custom jsx runtime
  //     jsxImportSource?: string       // Custom jsx import source,
  //     mdxType?: 'gfm' | 'commonmark' // Configure what kind of mdx syntax will be used to parse & transform
  //   },
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  experimental: {
    
  }
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

export default withMDX(nextConfig);
