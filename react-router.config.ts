import type {Config} from "@react-router/dev/config";

export default {
    ssr: true,
    serverModuleFormat: "cjs",
    appDirectory: "src"
} satisfies Config;