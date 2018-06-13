'use strict';

const assert = require('assert');
const kue = require('kue');
const Job = kue.Job;

/**
 * 接受config和app两个参数，并返回初始化一个Kue实例
 * @param  {Object} config   框架处理之后的配置项
 * @param  {Application} app 当前应用
 * @return {Object}          返回创建的 Kue 实例
 */

module.exports = app => {
  app.addSingleton('kue', createDelayedJob);
};

function createDelayedJob(config, app) {
  const { redis } = config;
  assert(redis && redis.host && redis.port && config.queuePrefix);

  const queue = kue.createQueue({
    prefix: config.queuePrefix,
    redis,
  });
  kue.app.listen(3000);
  app.beforeStart(function* () {
    const count = yield new Promise((resolve, reject) => {
      Job.client.zcard(Job.client.getKey('jobs'), (err, count) => {
        if (err) {
          reject(err);
        }
        resolve(count);
      });
    });
    app.coreLogger.info(`[egg-kue] instance status OK, current job count is ${count}`);
  });
  return queue;
}