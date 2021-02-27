import path from "path";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Executor, Task, utils, vm, WorkContext } from "yajsapi";
import { program } from "commander";
import {CodePenParams} from "./codepen_import";

dayjs.extend(duration);

const { asyncWith, logUtils, range } = utils;

async function main(subnetTag: string, driver: string, network: string, hash: string, cpu?: number, memory?: number, storage?:number) {
  if (cpu == undefined || Number.isNaN(cpu)) {
    cpu = 1;
  }

  if (memory == undefined || Number.isNaN(memory)) {
    memory = 1;
  }

  if (storage == undefined || Number.isNaN(storage)) {
    storage = 2;
  }

  console.log("subnet=", subnetTag);
  console.log("hash=", hash);
  console.log("cpu=", cpu);
  console.log("memory=", memory);
  console.log("storage=", storage);

  const _package = await vm.repo({
    image_hash: hash,
    min_mem_gib: memory,
    min_storage_gib: storage,
  });

  let penParams = new CodePenParams();

  console.log("tasks=", penParams.taskGetter());
  console.log("timeout=", penParams.timeout);
  console.log("workers=", penParams.workers);


  await asyncWith(
    new Executor({
      task_package: _package,
      max_workers: penParams.workers,
      timeout: penParams.timeout, //5 min to 30 min
      budget: "10.0", // Budget
      subnet_tag: subnetTag,
      driver: driver,
      network: network,
      event_consumer: logUtils.logSummary(),
    }),
    async (executor: Executor): Promise<void> => {
      for await (let task of executor.submit(
        penParams.workDefinition,
        penParams.taskGetter().map((frame) => new Task(frame))
      )) {
        console.log("result=", task.result());
      }
    }
  );
  return;
}

function parseIntParam(value: string) {
  return parseInt(value);
}

program
  .option('--subnet-tag <subnet>', 'set subnet name', 'devnet-beta.1')
  .option("--driver <driver>", "payment driver name, for example 'zksync'", "zksync")
  .option("--network <network>", "network name, for example 'rinkeby'", "rinkeby")
  .option('-d, --debug', 'output extra debugging')
  .requiredOption('-h, --hash <hash>', 'golem VM image hash', '9a3b5d67b0b27746283cb5f287c13eab1beaa12d92a9f536b747c7ae')
  .option('-c, --cpu <number>', '# of cores required', parseIntParam)
  .option('-m, --memory <number>', 'GB of memory required', parseIntParam)
  .option('-s, --storage <number>', 'GB of storage required', parseIntParam);
program.parse(process.argv);
if (program.debug) {
  utils.changeLogLevel("debug");
}
console.log(`Using subnet: ${program.subnetTag}, network: ${program.network}, driver: ${program.driver}`);
main(program.subnetTag, program.driver, program.network, program.hash, program.cpu, program.memory, program.storage);