

export interface getLinkList {
	"domain_id": string;
	"limit":number;
	"beforeDate"?:string;
	"afterDate"?:string;
	"dateSortOrder"?:string;
	"pageToken"?:string;

	[key: string]: any;


}

interface User {
  id: number;
  name: string | null;
  email: string;
  photoURL: string | null;
}

interface returnedLinkFromList {
  lcpath: string;
  createdAt: string;
  source: string;
  DomainId: number;
  archived: boolean;
  OwnerId: number;
  updatedAt: string;
  originalURL: string;
  tags: string[];        // Assuming the tags are strings; adjust if the tag structure is more complex
  cloaking: boolean;
  path: string;
  idString: string;
  shortURL: string;
  secureShortURL: string;
  id: string;
  User: User;
}


export interface getLinkListResponse {
	"links"?:returnedLinkFromList[];
	"count"?: number;
	"nextPageToken"?: string;
}
