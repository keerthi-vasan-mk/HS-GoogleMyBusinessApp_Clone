// Toast Enums.
export const ToastType = {
  INFO: 0,
  ERROR: 1,
};

// Post Buttons.
export const CTA_BUTTON_TYPES = {
  LEARN_MORE: 'LEARN_MORE',
  BOOK: 'BOOK',
  SHOP: 'SHOP',
  ORDER: 'ORDER',
  SIGN_UP: 'SIGN_UP',
  CALL: 'CALL'
}

export const CTA_BUTTON_LABELS = {
  LEARN_MORE: 'Learn more',
  BOOK: 'Book',
  SHOP: 'Shop',
  ORDER: 'Order online',
  SIGN_UP: 'Sign up',
}

export const BUTTON_OPTIONS = [
  { label: CTA_BUTTON_LABELS.BOOK, value: CTA_BUTTON_TYPES.BOOK },
  { label: CTA_BUTTON_LABELS.ORDER, value: CTA_BUTTON_TYPES.ORDER },
  { label: CTA_BUTTON_LABELS.LEARN_MORE, value: CTA_BUTTON_TYPES.LEARN_MORE },
  { label: CTA_BUTTON_LABELS.SIGN_UP, value: CTA_BUTTON_TYPES.SIGN_UP },
  { label: CTA_BUTTON_LABELS.SHOP, value: CTA_BUTTON_TYPES.SHOP },
];

export const STREAM_OPTIONS = [
  { label: 'Reviews', value: 'reviews' },
  { label: 'Questions', value: 'questions' },
  { label: 'Posts', value: 'posts' }
];