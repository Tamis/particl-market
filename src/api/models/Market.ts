// Copyright (c) 2017-2019, The Particl Market developers
// Distributed under the GPL software license, see the accompanying
// file COPYING or https://github.com/particl/particl-market/blob/develop/LICENSE

import { Bookshelf } from '../../config/Database';

export class Market extends Bookshelf.Model<Market> {

    public static async fetchById(value: number, withRelated: boolean = true): Promise<Market> {
        if (withRelated) {
            return await Market.where<Market>({ id: value }).fetch({
                withRelated: [
                ]
            });
        } else {
            return await Market.where<Market>({ id: value }).fetch();
        }
    }

    public static async fetchByAddress(value: string, withRelated: boolean = true): Promise<Market> {
        if (withRelated) {
            return await Market.where<Market>({ address: value }).fetch({
                withRelated: [
                ]
            });
        } else {
            return await Market.where<Market>({ address: value }).fetch();
        }
    }

    public static async fetchByName(value: string, withRelated: boolean = true): Promise<Market> {
        if (withRelated) {
            return await Market.where<Market>({ name: value }).fetch({
                withRelated: [
                ]
            });
        } else {
            return await Market.where<Market>({ name: value }).fetch();
        }
    }

    public get tableName(): string { return 'markets'; }
    public get hasTimestamps(): boolean { return true; }

    public get Id(): number { return this.get('id'); }
    public set Id(value: number) { this.set('id', value); }

    public get Name(): string { return this.get('name'); }
    public set Name(value: string) { this.set('name', value); }

    public get ReceiveKey(): string { return this.get('receive_key'); }
    public set ReceiveKey(value: string) { this.set('receive_key', value); }

    public get ReceiveAddress(): string { return this.get('receive_address'); }
    public set ReceiveAddress(value: string) { this.set('receive_address', value); }

    public get PublishKey(): string { return this.get('publish_key'); }
    public set PublishKey(value: string) { this.set('publish_key', value); }

    public get PublishAddress(): string { return this.get('publish_address'); }
    public set PublishAddress(value: string) { this.set('publish_address', value); }

    public get UpdatedAt(): Date { return this.get('updatedAt'); }
    public set UpdatedAt(value: Date) { this.set('updatedAt', value); }

    public get CreatedAt(): Date { return this.get('createdAt'); }
    public set CreatedAt(value: Date) { this.set('createdAt', value); }

}
