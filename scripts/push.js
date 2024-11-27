#!/usr/bin/env node
// Implements the pwa-kit-dev push command
// WHY? because pwa-kit-dev itself has hard dependencies on webpack, react, typescript, pwa-kit-runtime, etc
// and we just want to use it's MRT tools like push. so instead that's copied here

import * as scriptUtils from './script-utils.cjs'
import path from 'node:path'
import {fileURLToPath} from "node:url";
import fse from 'fs-extra'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const DEFAULT_CLOUD_ORIGIN = 'https://cloud.mobify.com'

// TODO do this the pwa way or import from getConfig (convert this dir to commonjs)
async function getConfig({buildDirectory}) {
    const config = (await import(path.resolve(buildDirectory, 'config/default.js'))).default
    return config
}

async function main(projectSlug, target) {
    const buildDirectory = path.resolve(__dirname, '../build')
    const credentialsFile = scriptUtils.getCredentialsFile(DEFAULT_CLOUD_ORIGIN)
    const credentials = await scriptUtils.readCredentials(credentialsFile)

    const message = "THA BUNDLE"

    if (!fse.pathExistsSync(buildDirectory)) {
        throw new Error(`Supplied "buildDirectory" does not exist!`)
    }

    const mobify = await getConfig({buildDirectory}) || {}

    const bundle = await scriptUtils.createBundle({
        message,
        ssr_parameters: mobify.ssrParameters,
        ssr_only: mobify.ssrOnly,
        ssr_shared: mobify.ssrShared,
        buildDirectory,
        projectSlug
    })
    const client = new scriptUtils.CloudAPIClient({
        credentials,
        origin: DEFAULT_CLOUD_ORIGIN
    })

    console.log(`Beginning upload to ${DEFAULT_CLOUD_ORIGIN}`)
    const data = await client.push(bundle, projectSlug, target)
    const warnings = data.warnings || []
    warnings.forEach(console.warn)
    console.log('Bundle Uploaded')
}

// get project and target from CLI arguments and throw error if not provided
const projectSlug = process.argv[2]
const target = process.argv[3]
if (!projectSlug || !target) {
    throw new Error('Usage: push.js <project> <environment>')
}

await main(projectSlug, target)
