export interface ITechService {
    list: () => angular.IPromise<any>;
}

interface ICustomNgPromise extends angular.IPromise<{}> {
    $$state: {
        pending: any[];
    };
}

export class TechService implements ITechService {
    data: any[];
    private deferred: angular.IDeferred<{}>;

    constructor (
        private $http: angular.IHttpService,
        private $q: angular.IQService
    ) {
        this.deferred = this.$q.defer();
    }

    list (): angular.IPromise<{}> {
        const state = (this.deferred.promise as ICustomNgPromise).$$state;

        if (state.pending && state.pending.length && !this.data) {
            return this.deferred.promise;
        }

        if (this.data && this.data.length) {
            this.deferred.resolve(this.data);
            return;
        }

        this.$http.get(`http://jsonplaceholder.typicode.com/photos`)
            .then((response) => {
                let data = [];
                for (var index = 0; index < (response.data as Array<any>).length; index++) {
                    if (index < 50 ) {
                        let item = response.data[index];
                        let obj = {
                            key: item.id,
                            title: item.title,
                            logo: item.thumbnailUrl
                        };
                        data.push(obj);
                    } else {
                        break;
                    }
                }

            this.data = data;
            this.deferred.resolve(data);
        });

        return this.deferred.promise;
    }
}
