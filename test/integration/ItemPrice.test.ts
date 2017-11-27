import { app } from '../../src/app';
import { Logger as LoggerType } from '../../src/core/Logger';
import { Types, Core, Targets } from '../../src/constants';
import { TestUtil } from './lib/TestUtil';
import { TestDataService } from '../../src/api/services/TestDataService';

import { ValidationException } from '../../src/api/exceptions/ValidationException';
import { NotFoundException } from '../../src/api/exceptions/NotFoundException';

import { ItemPrice } from '../../src/api/models/ItemPrice';
import { Currency } from '../../src/api/enums/Currency';
import { CryptocurrencyAddressType } from '../../src/api/enums/CryptocurrencyAddressType';

import { ItemPriceService } from '../../src/api/services/ItemPriceService';

describe('ItemPrice', () => {

    const log: LoggerType = new LoggerType(__filename);
    const testUtil = new TestUtil();

    let testDataService: TestDataService;
    let itemPriceService: ItemPriceService;

    let createdId;

    const testData = {
        currency: Currency.BITCOIN,
        basePrice: 0.0001,
        shippingPrice: {
            domestic: 0.123,
            international: 1.234
        },
        address: {
            type: CryptocurrencyAddressType.NORMAL,
            address: '1234'
        }
    };

    const testDataUpdated = {
        currency: Currency.PARTICL,
        basePrice: 0.002,
        shippingPrice: {
            domestic: 1.234,
            international: 2.345
        },
        address: {
            type: CryptocurrencyAddressType.STEALTH,
            address: '4567'
        }
    };

    beforeAll(async () => {
        await testUtil.bootstrapAppContainer(app);  // bootstrap the app

        testDataService = app.IoC.getNamed<TestDataService>(Types.Service, Targets.Service.TestDataService);
        itemPriceService = app.IoC.getNamed<ItemPriceService>(Types.Service, Targets.Service.ItemPriceService);

        // clean up the db, first removes all data and then seeds the db with default data
        await testDataService.clean([]);
    });

    afterAll(async () => {
        //
    });

    test('Should throw ValidationException because there is no payment_information_id', async () => {
        expect.assertions(1);
        await itemPriceService.create(testData).catch(e =>
            expect(e).toEqual(new ValidationException('Request body is not valid', []))
        );
    });

    test('Should create a new item price', async () => {
        testData['payment_information_id'] = 0;
        const itemPriceModel: ItemPrice = await itemPriceService.create(testData);
        createdId = itemPriceModel.Id;

        const result = itemPriceModel.toJSON();

        expect(result.currency).toBe(testData.currency);
        expect(result.basePrice).toBe(testData.basePrice);
        expect(result.ShippingPrice.domestic).toBe(testData.shippingPrice.domestic);
        expect(result.ShippingPrice.international).toBe(testData.shippingPrice.international);
        expect(result.Address.type).toBe(testData.address.type);
        expect(result.Address.address).toBe(testData.address.address);
    });

    test('Should throw ValidationException because we want to create a empty item price', async () => {
        expect.assertions(1);
        await itemPriceService.create({}).catch(e =>
            expect(e).toEqual(new ValidationException('Request body is not valid', []))
        );
    });

    test('Should list item prices with our new create one', async () => {
        const itemPriceCollection = await itemPriceService.findAll();
        const itemPrice = itemPriceCollection.toJSON();
        expect(itemPrice.length).toBe(1);

        const result = itemPrice[0];

        expect(result.currency).toBe(testData.currency);
        expect(result.basePrice).toBe(testData.basePrice);
        expect(result.ShippingPrice).toBe(undefined); // doesnt fetch related
        expect(result.Address).toBe(undefined); // doesnt fetch related
    });

    test('Should return one item price', async () => {
        const itemPriceModel: ItemPrice = await itemPriceService.findOne(createdId);
        const result = itemPriceModel.toJSON();

        expect(result.currency).toBe(testData.currency);
        expect(result.basePrice).toBe(testData.basePrice);
        expect(result.ShippingPrice.domestic).toBe(testData.shippingPrice.domestic);
        expect(result.ShippingPrice.international).toBe(testData.shippingPrice.international);
        expect(result.Address.type).toBe(testData.address.type);
        expect(result.Address.address).toBe(testData.address.address);
    });

    test('Should throw ValidationException because there is no payment_information_id', async () => {
        expect.assertions(1);
        await itemPriceService.update(createdId, testDataUpdated).catch(e =>
            expect(e).toEqual(new ValidationException('Request body is not valid', []))
        );
    });

    test('Should update the item price', async () => {
        testDataUpdated['payment_information_id'] = 0;
        const itemPriceModel: ItemPrice = await itemPriceService.update(createdId, testDataUpdated);
        const result = itemPriceModel.toJSON();

        expect(result.currency).toBe(testDataUpdated.currency);
        expect(result.basePrice).toBe(testDataUpdated.basePrice);
        expect(result.ShippingPrice.domestic).toBe(testDataUpdated.shippingPrice.domestic);
        expect(result.ShippingPrice.international).toBe(testDataUpdated.shippingPrice.international);
        expect(result.Address.type).toBe(testDataUpdated.address.type);
        expect(result.Address.address).toBe(testDataUpdated.address.address);
    });

    test('Should delete the item price', async () => {
        expect.assertions(1);
        await itemPriceService.destroy(createdId);
        await itemPriceService.findOne(createdId).catch(e =>
            expect(e).toEqual(new NotFoundException(createdId))
        );
    });

});
