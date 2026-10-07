// test/register.mjs — 给冒烟测试注册模块解析 shim。
import { register } from 'node:module';

register('./shims/loader.mjs', import.meta.url);
