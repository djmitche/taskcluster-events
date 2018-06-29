const debug     = require('debug')('test:get_msg');
const assert    = require('assert');
const helper    = require('./helper');
const _         = require('lodash');

helper.secrets.mockSuite(__filename, [], function(mock, skipping) {
  helper.withPulse(mock, skipping);
  helper.withServer(mock, skipping);

  test('More than one key in query', async () => {
    let bindings = {bindings : [ 
      {exchange :  'exchange/taskcluster-foo/v1/bar', routingKey : '#'},
    ], foo: 'bar'};

    let {evtSource, resolve, pass, fail} = helper.connect(bindings);

    evtSource.addEventListener('error', (e) => {
      assert(_.includes(e.data, 'The json query should have only one key'));
      evtSource.close();
      pass();
    });
    await resolve;
  });

  test('Bindings is not an array', async () => {
    let bindings = {bindings : {exchange :  'exchange/taskcluster-foo/v1/bar', routingKey : '#'}};

    let {evtSource, resolve, pass, fail} = helper.connect(bindings);

    evtSource.addEventListener('error', (e) => {
      assert(_.includes(e.data, 'Bindings must be an array of {exchange, routingKey}'));
      evtSource.close();
      pass();
    });
    await resolve;
  });

});