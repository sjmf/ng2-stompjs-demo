import { Ng2StompjsDemoPage } from './app.po';

describe('ng2-stompjs-demo App', function() {
  let page: Ng2StompjsDemoPage;

  beforeEach(() => {
    page = new Ng2StompjsDemoPage();
  });

  it('should display message saying Angular 2 STOMP.js Demo', () => {
    page.navigateTo();
    expect(page.getHeaderText()).toEqual('Angular 2 STOMP.js Demo');
  });
});
