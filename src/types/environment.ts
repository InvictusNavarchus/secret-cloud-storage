/**
 * Environment bindings for the Cloudflare Worker
 */
export interface Environment {
	/**
	 * R2 bucket binding for file storage
	 */
	readonly BUCKET: R2Bucket;

	/**
	 * Assets binding for serving static files
	 */
	readonly ASSETS: Fetcher;
}
