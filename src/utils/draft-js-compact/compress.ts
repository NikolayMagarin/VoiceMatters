import { RawDraftContentBlock, RawDraftContentState } from 'draft-js';
import { defaultCompressOpts } from './util';

export const compressRawBlock =
  (opts: Partial<typeof defaultCompressOpts>) =>
  (block: RawDraftContentBlock) => {
    const { data, depth, entityRanges, inlineStyleRanges, key, text, type } =
      block;
    const compact = {} as RawDraftContentBlock;
    if (Object.keys(data || {}).length) {
      compact.data = data;
    }
    if (depth) {
      compact.depth = depth;
    }
    if (entityRanges?.length) {
      compact.entityRanges = entityRanges;
    }
    if (inlineStyleRanges?.length) {
      compact.inlineStyleRanges = inlineStyleRanges;
    }
    if (!opts.discardKeys && key) {
      compact.key = key;
    }
    if (text) {
      compact.text = text;
    }
    if (type !== 'unstyled') {
      compact.type = type;
    }

    return compact;
  };

export const compress = (raw: RawDraftContentState, opts = {}) => {
  const { discardKeys } = { ...defaultCompressOpts, ...opts };

  const blocks = raw.blocks.map(compressRawBlock({ discardKeys }));
  if (!Object.keys(raw.entityMap || {}).length) {
    return { blocks };
  }
  return {
    blocks,
    entityMap: raw.entityMap,
  };
};
