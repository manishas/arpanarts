"use client";

import { useTina } from "tinacms/dist/react";
import type { PageQuery, PageQueryVariables } from "@/tina/__generated__/types";
import type { Listings } from "@/lib/data";
import Blocks from "./Blocks";

type Props = {
  query: string;
  variables: PageQueryVariables;
  data: PageQuery;
  listings: Listings;
  settings: { email?: string | null; phone?: string | null; address?: string | null };
};

export default function PageClient(props: Props) {
  // useTina makes the page update live while editing in /admin
  const { data } = useTina({ query: props.query, variables: props.variables, data: props.data });
  const blocks = data.page.blocks;
  const startsWithHero = blocks?.[0]?.__typename === "PageBlocksHero";
  return (
    <div className={startsWithHero ? "" : "pt-6"}>
      <Blocks blocks={blocks} listings={props.listings} settings={props.settings} />
    </div>
  );
}
