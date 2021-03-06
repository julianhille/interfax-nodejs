import Outbound   from '../src/outbound.js';
import Client     from '../src/client.js';
import Delivery   from '../src/delivery.js';

import chai, { expect } from 'chai';
import sinon            from 'sinon';
import sinonChai        from 'sinon-chai';

chai.use(sinonChai);

let outbound;
let client;
let delivery;
let callback = () => {};
let options = { limit: 1 };

describe('Outbound', () => {
  it('should export a Outbound object', () => {
    expect(Outbound).to.not.be.null;
    expect(Outbound.name).to.equal('Outbound');
  });

  describe('.instance', () => {
    beforeEach(() => {
      client    = sinon.createStubInstance(Client);
      delivery  = sinon.createStubInstance(Delivery);
      outbound  = new Outbound(client, delivery);
    });

    it('should be an Outbound object', () => {
      expect(outbound).to.be.an.instanceof(Outbound);
    });

    it('should save the client', () => {
      expect(outbound._client).to.be.equal(client);
    });

    it('should initialize the Delivery object', () => {
      expect(outbound._delivery).to.be.an.instanceof(Delivery);
    });

    describe('.deliver', () => {
      beforeEach(() => {
        delivery.deliver.returns('Promise');
      });

      it('should pass to the Delivery object', () => {
        expect(outbound.deliver(options, callback)).to.be.eql('Promise');
        expect(delivery.deliver).to.have.been.calledWith(options, callback);
      });
    });

    describe('.all', () => {
      beforeEach(() => {
        client.get.returns('Promise');
      });

      it('should call the client', () => {
        expect(outbound.all(callback)).to.be.eql('Promise');
        expect(client.get).to.have.been.calledWith('/outbound/faxes', callback, undefined);
      });

      it('should allow for options', () => {
        outbound.all(options, callback);
        expect(client.get).to.have.been.calledWith('/outbound/faxes', options, callback);
      });
    });

    describe('.completed', () => {
      beforeEach(() => {
        client.get.returns('Promise');
      });

      it('should call the client', () => {
        expect(outbound.completed([1,2], callback)).to.be.eql('Promise');
        expect(client.get).to.have.been.calledWith('/outbound/faxes/completed', { ids: [1,2] } , callback);
      });
    });

    describe('.find', () => {
      beforeEach(() => {
        client.get.returns('Promise');
      });

      it('should call the client', () => {
        expect(outbound.find(123, callback)).to.be.eql('Promise');
        expect(client.get).to.have.been.calledWith('/outbound/faxes/123', callback);
      });
    });

    describe('.image', () => {
      beforeEach(() => {
        client.get.returns('Promise');
      });

      it('should call the client', () => {
        expect(outbound.image(123, callback)).to.be.eql('Promise');
        expect(client.get).to.have.been.calledWith('/outbound/faxes/123/image', callback);
      });
    });

    describe('.cancel', () => {
      beforeEach(() => {
        client.post.returns('Promise');
      });

      it('should call the client', () => {
        expect(outbound.cancel(123, callback)).to.be.eql('Promise');
        expect(client.post).to.have.been.calledWith('/outbound/faxes/123/cancel', callback);
      });
    });

    describe('.search', () => {
      beforeEach(() => {
        client.get.returns('Promise');
      });

      it('should call the client', () => {
        expect(outbound.search({faxNumber: '123'}, callback)).to.be.eql('Promise');
        expect(client.get).to.have.been.calledWith('/outbound/search', {faxNumber: '123'}, callback);
      });
    });
  });
});
