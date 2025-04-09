import { defaultExpandOpts, isNullish } from './util';
import { RawDraftContentBlock, RawDraftContentState } from 'draft-js';

export const expand = (
  raw: RawDraftContentState,
  opts = {} as typeof defaultExpandOpts
) => {
  const { createBlock } = { ...defaultExpandOpts, ...opts };

  const blocks = raw.blocks.reduce<RawDraftContentBlock[]>((acc, block) => {
    if (isNullish(block)) {
      return acc;
    }
    acc.push(createBlock(block));
    return acc;
  }, []);

  return {
    blocks,
    entityMap: raw.entityMap || {},
  };
};
