// prettier-ignore

import PageLayout from '~/layouts/PageLayout.astro';

import type { MetaData } from '~/types';

export interface Props {
metadata?: MetaData;
availableLanguages: string[];
}

const metadata = {
title: 'Terms and Conditions',
};

const availableLanguages = ['en', 'es', 'fr']; // Example list of available languages

<PageLayout metadata={metadata} availableLanguages={availableLanguages}>
  # Terms and Conditions

This page outlines the terms and conditions for using our website.

## Usage

You may use our website for personal and commercial purposes, provided you comply with these terms and conditions.

## Privacy

Your privacy is important to us. Please refer to our [Privacy Policy](/privacy) for more information on how we handle your data.

## Disclaimer

We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.

## Copyright

The content of this website is protected by copyright. You may not reproduce, distribute, or create derivative works of the content without our explicit permission.

## Changes to Terms

We reserve the right to update and change our terms and conditions at any time. Any changes will be posted on this page, and your continued use of the website after any changes constitutes your acceptance of such changes.

## Contact

If you have any questions or concerns about these terms and conditions, please contact us at [support@cro.cafe](mailto:support@cro.cafe).
</PageLayout>
