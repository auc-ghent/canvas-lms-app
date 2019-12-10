/**
 * Extends normal Response object
 *
 *   - The result has "while(1);" prepended which will be stripped
 */
export default class CanvasApiResponse extends Response {

    get links() {
        let linkHeader = this.headers.get('Link');

        if (linkHeader === null) return null;

        return linkHeader.split(',').reduce((links, value) => {
            var match = value.match(/^<https:\/\/.+\/api\/v1\/(.+)>; rel="(\w+)"$/);

            if (match !== null) {
                let type = match[2];
                let url = '/' + match[1];

                links[type] = url;
            }

            return links;
        }, {});
    }

    constructor(response) {
        super(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        });
    }

    async text() {
        return (await super.text()).replace(/^while\(1\);/, '');
    }

    async json() {
        return JSON.parse(await this.text());
    }

}