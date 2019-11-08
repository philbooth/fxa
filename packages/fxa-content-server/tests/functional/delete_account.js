/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const { registerSuite } = intern.getInterface('object');
const TestHelpers = require('../lib/helpers');
const FunctionalHelpers = require('./lib/helpers');
const selectors = require('./lib/selectors');
const config = intern._config;

const ENTER_EMAIL_URL = config.fxaContentRoot;

const PASSWORD = 'password1234567';
let email;

const {
  clearBrowserState,
  click,
  createUser,
  fillOutDeleteAccount,
  fillOutEmailFirstSignIn,
  openPage,
  pollUntilHiddenByQSA,
  testElementExists,
  testSuccessWasShown,
} = FunctionalHelpers;

registerSuite('delete_account', {
  beforeEach: function() {
    email = TestHelpers.createEmail();

    return this.remote
      .then(clearBrowserState({ force: true }))
      .then(createUser(email, PASSWORD, { preVerified: true }));
  },

  tests: {
    'sign in, delete account': function() {
      return (
        this.remote
          .then(openPage(ENTER_EMAIL_URL, selectors.ENTER_EMAIL.HEADER))
          .then(fillOutEmailFirstSignIn(email, PASSWORD))
          .then(testElementExists(selectors.SETTINGS.HEADER))

          // Go to delete account screen
          .then(
            click(
              selectors.SETTINGS_DELETE_ACCOUNT.MENU_BUTTON,
              selectors.SETTINGS_DELETE_ACCOUNT.DETAILS
            )
          )
          .then(fillOutDeleteAccount(PASSWORD))

          .then(testElementExists(selectors.ENTER_EMAIL.HEADER))
          .then(testSuccessWasShown())
      );
    },

    'sign in, cancel delete account': function() {
      return (
        this.remote
          .then(openPage(ENTER_EMAIL_URL, selectors.ENTER_EMAIL.HEADER))
          .then(fillOutEmailFirstSignIn(email, PASSWORD))

          // Go to delete account screen
          .then(
            click(
              selectors.SETTINGS_DELETE_ACCOUNT.MENU_BUTTON,
              selectors.SETTINGS_DELETE_ACCOUNT.DETAILS
            )
          )

          .then(click(selectors.SETTINGS_DELETE_ACCOUNT.CANCEL))
          .then(pollUntilHiddenByQSA(selectors.SETTINGS_DELETE_ACCOUNT.DETAILS))
      );
    },
  },
});
