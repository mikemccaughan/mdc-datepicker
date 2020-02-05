import {
  MDCTextFieldRootAdapter,
  MDCTextFieldInputAdapter,
  MDCTextFieldLabelAdapter,
  MDCTextFieldLineRippleAdapter,
  MDCTextFieldOutlineAdapter
} from './node_modules/@material/textfield/index';
/**
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCDatePickerAdapter
  extends MDCTextFieldRootAdapter,
    MDCTextFieldInputAdapter,
    MDCTextFieldLabelAdapter,
    MDCTextFieldLineRippleAdapter,
    MDCTextFieldOutlineAdapter {}
