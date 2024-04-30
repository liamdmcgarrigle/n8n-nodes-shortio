

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


export interface DomainInfo {
  id: string;
  TeamId?: string | null;
  hostname?: string;
  hasFavicon?: boolean | null;
  segmentKey?: string | null;
  linkType?: string;
  enableAI?: boolean | null;
  state?: string;
  redirect404?: string;
  hideReferer?: boolean;
  hideVisitorIp?: boolean;
  caseSensitive?: boolean;
  exportEnabled?: boolean;
  cloaking?: boolean;
  incrementCounter?: string;
  httpsLinks?: boolean;
  sslCertExpirationDate?: string;
  sslCertInstalledSuccess?: boolean;
  clientStorage?: any | null;
  integrationGA?: any | null;
  integrationFB?: any | null;
  integrationAdroll?: any | null;
  integrationGTM?: any | null;
  webhookURL?: string | null;
  httpsLevel?: string;
  robots?: string;
  provider?: string;
  purgeExpiredLinks?: boolean;
  lastPurgeDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  faviconURL?: string | null;
  unicodeHostname?: string;
  isFavorite?: boolean;
}

export interface CreateShortLinkRequest {
	"domain"?: string;
	"originalURL":string;
	"path"?:string;
	"allowDuplicates"?:boolean;
	"title"?:string;
	"tags"?: string[];
	"expiresAt"?:number;
	"expiredURL"?:string;
	"iphoneURL"?:string;
	"androidURL"?:string;
	"cloaking"?:boolean;
	"redirectType"?:string;
	"password"?:string;
	"ttl"?:number;
	"utmSource"?:string;
	"utmMedium"?:string;
	"utmCampaign"?:string;
	"utmTerm"?:string;
	"utmContent"?:string;
}
