const FormHiddenDisabledSubmit = () => (
  // biome-ignore lint/a11y/noAriaHiddenOnFocusable: element is hidden and not focusable
  <button type="submit" disabled class="hidden" aria-hidden={true} />
);

export default FormHiddenDisabledSubmit;
