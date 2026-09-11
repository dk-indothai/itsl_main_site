import { test as base, expect } from '@playwright/test';

interface Options {
  autoDismissInvestorAlert: boolean;
}

export const test = base.extend<Options>({
  autoDismissInvestorAlert: [true, { option: true }],
  page: async ({ page, autoDismissInvestorAlert }, use) => {
    if (autoDismissInvestorAlert) {
      await page.addInitScript(() => {
        const dismissInvestorAlert = () => {
          const dialog = document.querySelector('[data-investor-alert]');
          if (dialog instanceof HTMLDialogElement && dialog.open)
            dialog.close();
        };
        new MutationObserver(dismissInvestorAlert).observe(document, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ['open'],
        });
        document.addEventListener('DOMContentLoaded', dismissInvestorAlert);
      });
    }
    await use(page);
  },
});

export const investorAlertTest = test.extend({
  autoDismissInvestorAlert: false,
});

export { expect };
export type { Page, Request } from '@playwright/test';
