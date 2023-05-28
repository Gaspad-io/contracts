const ethers = require("ethers");
require("dotenv").config();

const lauchpadDeployerJson = require("../artifacts/contracts/LaunchpadDeployer.sol/LaunchpadDeployer.json");
const launchpadDeployerAddress = process.argv[2];
const erc20Json = require("../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json");
const provider = new ethers.providers.JsonRpcProvider(process.env.NETWORK_URL);
const LaunchpadDeployer = new ethers.Contract(
  launchpadDeployerAddress,
  lauchpadDeployerJson.abi,
  provider
);

const approveToken = async (userPrivateKey, tokenAddress, spender) => {
  const erc20Contract = new ethers.Contract(
    tokenAddress,
    erc20Json.abi,
    provider
  );
  const adminWallet = new ethers.Wallet(userPrivateKey);
  const wallet = adminWallet.connect(provider);
  const _approve = erc20Contract.interface.encodeFunctionData("approve", [
    spender,
    BigInt(2 ** 100),
  ]);
  const params = {
    from: adminWallet.address,
    to: tokenAddress,
    data: _approve,
  };
  const tx = await wallet.sendTransaction(params);
  return tx.hash;
};

const createLaunchpad = async (
  _caps,
  _times,
  _rates,
  _limits,
  _adminFees,
  _tokens,
  _URIData,
  _refundWhenFinish,
  _launchpadType,
  _userPrivateKey
) => {
  const adminWallet = new ethers.Wallet(_userPrivateKey);
  const wallet = adminWallet.connect(provider);

  const _createLaunchPad = LaunchpadDeployer.interface.encodeFunctionData(
    "createLaunchpad",
    [
      _caps,
      _times,
      _rates,
      _limits,
      _adminFees,
      _tokens,
      _URIData,
      _refundWhenFinish,
      _launchpadType,
    ]
  );

  const params = {
    from: adminWallet.address,
    to: launchpadDeployerAddress,
    data: _createLaunchPad,
    value: ethers.utils.parseEther("0.01"),
  };
  const tx = await wallet.sendTransaction(params);
  return tx.hash;
};

const testCreateLaunchPad = async () => {
  const _caps = [1, 2];
  const _times = [1669712000, 1669712500, 1669712500];
  const _rates = [1, 2];
  const _limits = [1, 2];
  const _adminFees = [1, 2];
  const _tokens = [
    "0x85faEeF3a843075eCb68050B4995C036DeDc10D2",
    ethers.constants.AddressZero,
  ];
  const _URIData = "/test";
  const _refundWhenFinish = true;
  const _launchpadType = 0;
  const userPrivateKey =
    "92bc521fc833e6d53d7b6a29ca3c665b6ff626f2f311347b9f3410904f99c343";
  const approveHash = await approveToken(
    userPrivateKey,
    _tokens[0],
    launchpadDeployerAddress
  );
  console.log({ approveHash });
  const createLaunchpadHash = await createLaunchpad(
    _caps,
    _times,
    _rates,
    _limits,
    _adminFees,
    _tokens,
    _URIData,
    _refundWhenFinish,
    _launchpadType,
    userPrivateKey
  );
  console.log({ createLaunchpadHash });
};

testCreateLaunchPad();
