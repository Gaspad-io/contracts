const { ethers, network } = require("hardhat")
const { assert, expect } = require("chai")

describe("Launchpad deployer", () => {
	let launchpadDeployer,
		LaunchpadDeployer,
		launchpad,
		token,
		Token,
		owner,
		user,
		user2,
		caps,
		times,
		rates,
		limits,
		adminFees,
		tokens,
		uriData,
		refundWhenFinish,
		launchpadType,
		launchpadAddr,
		tokenBalance,
		now

	const delay = async (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000))

	before(async () => {
		LaunchpadDeployer = await ethers.getContractFactory("LaunchpadDeployer")
		launchpadDeployer = await LaunchpadDeployer.deploy()
		await launchpadDeployer.deployed()

		Token = await ethers.getContractFactory("Token")
		token = await Token.deploy()
		await token.deployed()

		const signers = await ethers.getSigners()
		owner = signers[0]
		user = signers[1]
		user2 = signers[2]

		await token.connect(owner).approve(launchpadDeployer.address, ethers.utils.parseEther("100000000"))

		caps = [ethers.utils.parseEther("0.02"), ethers.utils.parseEther("0.05")]
		rates = [100000, 90000]
		limits = [ethers.utils.parseEther("0.001"), ethers.utils.parseEther("0.1")]
		adminFees = [5000, 5000]
		tokens = [token.address, "0x0000000000000000000000000000000000000000"]
		uriData = "https://www.epochconverter.com"
		now = Math.floor(Date.now() / 1000)
	})

	describe("Test", async () => {
		it("createLaunchpad", async () => {
			times = [now, now + 10, now + 10]
			refundWhenFinish = true
			launchpadType = 0
			await launchpadDeployer
				.connect(owner)
				.createLaunchpad(
					caps,
					times,
					rates,
					limits,
					adminFees,
					tokens,
					uriData,
					refundWhenFinish,
					launchpadType,
					{
						value: ethers.utils.parseEther("0.001"),
					}
				)
			launchpadAddr = await launchpadDeployer.userLaunchpadCreated(0, owner.address, 0)
			launchpad = await ethers.getContractAt("LaunchPad", launchpadAddr)
			console.log("Token of launchpad:", ethers.utils.formatEther(await token.balanceOf(launchpadAddr)))
		})

		it("Invest", async () => {
			// await launchpad
			// 	.connect(user2)
			// 	.invest(ethers.utils.parseEther("0.005"), { value: ethers.utils.parseEther("0.005") })

			await launchpad
				.connect(user)
				.invest(ethers.utils.parseEther("0.04"), { value: ethers.utils.parseEther("0.04") })
		})

		// it("claimRefund", async () => {
		// 	await launchpad.connect(user2).claimRefund()
		// 	await launchpad
		// 		.connect(user2)
		// 		.invest(ethers.utils.parseEther("0.01"), { value: ethers.utils.parseEther("0.01") })
		// })

		it("claimFund", async () => {
			console.log("Before token balance:", ethers.utils.formatEther(await token.balanceOf(user.address)))
			await delay(10)
			console.log("Before token balance of launchpad:", ethers.utils.formatEther(await token.balanceOf(launchpadAddr)))
			await launchpad.connect(user).claimFund()
			// await launchpad.connect(user2).claimFund()
			console.log("After token balance:", ethers.utils.formatEther(await token.balanceOf(user.address)))
			console.log("After token balance of launchpad:", ethers.utils.formatEther(await token.balanceOf(launchpadAddr)))
		})

		// it("finishSale", async () => {
		// 	console.log("Before token balance:", ethers.utils.formatEther(await token.balanceOf(owner.address)))
        //     await launchpad.connect(owner).finishSale()
		// 	console.log("After token balance:", ethers.utils.formatEther(await token.balanceOf(owner.address)))
        // })
        it ("cancelSale", async() => {
            await launchpad.connect(owner).finishSale()
        })
	})
})
