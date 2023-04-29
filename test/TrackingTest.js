const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Tracking", function () {
  const ShipmentStatus = {
    PENDING: 0,
    IN_TRANSIT: 1,
    DELIVERED: 2,
  };
  let accounts, deployer, sender, receiver, tracking;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    sender = accounts[1];
    receiver = accounts[2];

    const Tracking = await ethers.getContractFactory("Tracking");
    tracking = await Tracking.deploy();
    await tracking.deployed();
  });

  it("should pass the shipmentCount", async function () {
    expect(await tracking.shipmentCount()).to.equal(0);
  });

  describe("Create Shipment", function () {
    describe("Success", function () {
      let transaction,
        result,
        pickupTime = 10,
        distance = 10,
        price = 100;

      beforeEach(async function () {
        // calculate the amount of ether to send based on the price of the shipment
        const value = ethers.utils.parseEther(price.toString());

        transaction = await tracking.createShipment(receiver.address, pickupTime, distance, price, { value });
        result = await transaction.wait();
      });

      it("should equal shipmentCount ", async function () {
        expect(await tracking.shipmentCount()).to.equal(1);
      });

      it("should emit a shipment create event", async function () {
        const event = result.events[0];
        const args = event.args;
        expect(event.event).to.equal('ShipmentCreated');
        expect(args.sender).to.equal(deployer.address);
        expect(args.receiver).to.equal(receiver.address);
        expect(args.pickupTime).to.equal(pickupTime);
        expect(args.distance).to.equal(distance);
        expect(args.price).to.equal(price);
        

          
              
      });
    });
  });
});
