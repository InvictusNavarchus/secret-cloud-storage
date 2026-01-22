/**
 * Environment bindings for Cloudflare Pages
 */
export interface Environment {
	/**
	 * R2 bucket binding for file storage
	 */
	readonly BUCKET: R2Bucket;
}
