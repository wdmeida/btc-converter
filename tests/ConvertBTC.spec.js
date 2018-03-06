const nock = require('nock');
const chalk = require('chalk');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const { expect } = chai;

const convertBTC = require('../src/ConvertBTC');

describe('ConvertBTC', () => {
  let consoleStub;

  const responseNock = {
    success: true,
    time: '2018-03-06 14:39:05',
    price: 10960.55,
  };

  beforeEach(() => {
    consoleStub = sinon.stub(console, 'info');
  });

  afterEach(() => {
    consoleStub.restore();
  });

  it('should use currency USD and 1 as amount default', async () => {
    nock('https://apiv2.bitcoinaverage.com')
      .get('/convert/global')
      .query({ from: 'BTC', to: 'USD', amount: 1 })
      .reply(200, responseNock);

    await convertBTC();
    expect(consoleStub).to.have.been.calledWith(`${chalk.red(1)} BTC to ${chalk.cyan('USD')} = ${chalk.yellow(10960.55)}`);
  });

  it('should use currency USD and 10 as amount default', async () => {
    nock('https://apiv2.bitcoinaverage.com')
      .get('/convert/global')
      .query({ from: 'BTC', to: 'USD', amount: 10 })
      .reply(200, responseNock);

    await convertBTC('USD', 10);
    expect(consoleStub).to.have.been.calledWith(`${chalk.red(10)} BTC to ${chalk.cyan('USD')} = ${chalk.yellow(10960.55)}`);
  });

  it('should use currency BRL and 1 as amount default', async () => {
    nock('https://apiv2.bitcoinaverage.com')
      .get('/convert/global')
      .query({ from: 'BTC', to: 'BRL', amount: 1 })
      .reply(200, responseNock);

    await convertBTC('BRL');
    expect(consoleStub).to.have.been.calledWith(`${chalk.red(1)} BTC to ${chalk.cyan('BRL')} = ${chalk.yellow(10960.55)}`);
  });

  it('should message user when api reply with error', async () => {
    nock('https://apiv2.bitcoinaverage.com')
      .get('/convert/global')
      .query({ from: 'BTC', to: 'BRL', amount: 1 })
      .replyWithError('Error');

    await convertBTC('BRL');
    expect(consoleStub).to.have.been.calledWith(chalk.red('Something went wrong in API. Try in a few minutes.'));
  });
});
