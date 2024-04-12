/// <reference types="vitest" />
/// <reference types="vite/client" />

import type { CollectionValues } from '@odk-web-forms/common/types/collections/CollectionValues.ts';
import { resolve } from 'path';
import GithubActionsReporter from 'vitest-github-actions-reporter';
import { defineConfig } from 'vitest/config';

export default defineConfig(() => {
	const supportedBrowsers = new Set(['chromium', 'firefox', 'webkit'] as const);

	type SupportedBrowser = CollectionValues<typeof supportedBrowsers>;

	const isSupportedBrowser = (browserName: string): browserName is SupportedBrowser =>
		supportedBrowsers.has(browserName as SupportedBrowser);

	const BROWSER_NAME = (() => {
		const envBrowserName = process.env.BROWSER_NAME;

		if (envBrowserName == null) {
			return null;
		}

		if (isSupportedBrowser(envBrowserName)) {
			return envBrowserName;
		}

		throw new Error(`Unsupported browser: ${envBrowserName}`);
	})();

	const BROWSER_ENABLED = BROWSER_NAME != null;
	const TEST_ENVIRONMENT = BROWSER_ENABLED ? 'node' : 'jsdom';

	return {
		build: {
			target: false as const,
		},
		esbuild: {
			sourcemap: true,
			target: 'esnext',
		},
		optimizeDeps: {
			esbuildOptions: {
				target: 'esnext',
			},
			exclude: ['@odk-web-forms/xforms-engine'],
			force: true,
		},
		resolve: {
			alias: {
				'@odk-web-forms/xforms-engine': resolve(__dirname, '../xforms-engine/src/index.ts'),
			},
			conditions: ['solid', 'browser', 'development'],
		},
		test: {
			browser: {
				enabled: BROWSER_ENABLED,
				name: BROWSER_NAME!,
				provider: 'playwright',
				headless: true,
			},

			deps: {
				optimizer: {
					web: {
						// Prevent loading multiple instances of Solid. This deviates from
						// most of the recommendations provided by Solid and related tooling,
						// as Vitest's interfaces have since changed. But it does seem to be
						// the appropriate solution (at least for our usage).
						exclude: ['solid-js'],
					},
				},
				moduleDirectories: ['node_modules', '../../node_modules'],
			},
			environment: TEST_ENVIRONMENT,
			globals: false,

			reporters: process.env.GITHUB_ACTIONS ? ['default', new GithubActionsReporter()] : 'default',
		},
	};
});