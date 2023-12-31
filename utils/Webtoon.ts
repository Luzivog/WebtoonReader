export type Chapter = { name: string; released: string; url: string };

class Webtoon {
	private _name: string;
	private _imageUrl: string;
	private _apiUrl: string;
	private _details: {[key: string]: string};
	private _chapters: Chapter[];
	private _allChapters: boolean;

	constructor(name: string, imageUrl: string, apiUrl: string) {
		this._name = name;
		this._imageUrl = imageUrl;
		this._apiUrl = apiUrl;
		this._details = {};
		this._chapters = [];
		this._allChapters = false;
	}

	// Getter for name
	get name(): string {
		return this._name;
	}

	// Setter for name
	set name(newName: string) {
		this._name = newName;
	}

	// Getter for imageUrl
	get imageUrl(): string {
		return this._imageUrl;
	}

	// Setter for imageUrl
	set imageUrl(newImageUrl: string) {
		this._imageUrl = newImageUrl;
	}

	// Getter for apiUrl
	get apiUrl(): string {
		return this._apiUrl;
	}

	// Setter for apiUrl
	set apiUrl(newApiUrl: string) {
		this._apiUrl = newApiUrl;
	}

	// Getter for details
	get details(): { [key: string]: string } {
		return this._details;
	}

	// Setter for details
	set details(newDetails: { [key: string]: string }) {
		this._details = newDetails;
	}

	// Getter for chapters
	get chapters(): { name: string, released: string, url: string }[] {
		return this._chapters;
	}

	// Setter for chapters
	set chapters(newChapters: { name: string, released: string, url: string }[]) {
		this._chapters = newChapters;
	}

	// Getter for chapters
	get allChapters(): boolean {
		return this._allChapters;
	}

	// Setter for chapters
	set allChapters(value: boolean) {
		this._allChapters = value;
	}
}

export default Webtoon;