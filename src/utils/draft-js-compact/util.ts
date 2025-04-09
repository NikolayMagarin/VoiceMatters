import {
  convertToRaw as convertFromDraftStateToRaw,
  genKey,
  RawDraftContentBlock,
} from 'draft-js';

export const isNullish = (val: any) =>
  typeof val === 'undefined' || val === null;

const defaultBlockProperties = {
  data: {},
  depth: 0,
  entityRanges: [],
  inlineStyleRanges: [],
  text: '',
  type: 'unstyled',
};

const blockProperties = defaultBlockProperties;

export const defaultExpandOpts = {
  createBlock: (block: Partial<RawDraftContentBlock>) => ({
    key: genKey(),
    ...blockProperties,
    ...block,
  }),
};

export const defaultCompressOpts = {
  discardKeys: true,
  convertToRaw: convertFromDraftStateToRaw,
};
