import path from "path";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Engine, Task, utils, vm, WorkContext } from "yajsapi";

dayjs.extend(duration);

const { asyncWith, logUtils, range } = utils;

export class CodePenParams {
  timeout: number = dayjs.duration({ minutes: 15 }).asMilliseconds();

  workers: number = 6;

  taskGetter = function getTasks(): any[] {
    return range(0, 60, 10);
  }

  workDefinition = async function* worker(ctx: WorkContext, tasks) {
    ctx.send_file(
      path.join(__dirname, "./cubes.blend"),
      "/golem/resource/scene.blend"
    );

    for await (let task of tasks) {
      let frame: any = task.data();
      let crops = [
        {
          outfilebasename: "out",
          borders_x: [0.0, 1.0],
          borders_y: [0.0, 1.0],
        },
      ];
      ctx.send_json("/golem/work/params.json", {
        scene_file: "/golem/resource/scene.blend",
        resolution: [400, 300],
        use_compositing: false,
        crops: crops,
        samples: 100,
        frames: [frame],
        output_format: "PNG",
        RESOURCES_DIR: "/golem/resources",
        WORK_DIR: "/golem/work",
        OUTPUT_DIR: "/golem/output",
      });

      let commands = [
        "-c",
        `/golem/entrypoints/run-blender.sh;`
      ]

      ctx.run("/bin/sh", commands);

      const output_file = `output_${frame.toString()}.png`;

      ctx.download_file(
        `/golem/output/out${frame.toString().padStart(4, "0")}.png`,
        path.join(__dirname, `./output_${frame}.png`)
      );
      yield ctx.commit();
      // TODO: Check
      // job results are valid // and reject by:
      // task.reject_task(msg = 'invalid file')
      task.accept_task(output_file);
    }

    ctx.log("no more frames to render");
    return;
  }
}