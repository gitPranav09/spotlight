class ReportProxy {
    provider = null
    contract = null
    signer = null
    isConnected = false;
    account = { address: '', balance: '' }

    async connect() {
        this.provider = new ethers.providers.Web3Provider(window.ethereum)
        await this.provider.send("eth_requestAccounts", []);
        this.signer = this.provider.getSigner()
        this.contract = new ethers.Contract(contractAddress, abi, this.signer);
        this.isConnected = this.provider && this.signer && this.contract;
        await this.getAccount()
    }

    async getAccount() {
        if (!this.isConnected) {
            console.log("Connect Your Account to Continue!")
            this.account = { address: '', balance: '' }
            return this.account
        }

        const address = await this.signer.getAddress()
        const balance = ethers.utils.formatEther(await this.signer.getBalance())

        return this.account = { address, balance }
    }

    async createApplication(subject, description, fileLink) {
        if (!this.isConnected) {
            console.log("Connect Your Account to Continue!")
            return []
        }
        let data = {
            id: uuid(),
            subject,
            description,
            fileLink
        }
        const tx = await this.contract.functions.create(
            data.id,
            data.subject,
            data.description,
            data.fileLink
        )
        const receipt = await tx.wait();
        console.log(receipt);
    }

    async getApplicationByID(id) {
        if (!this.isConnected) {
            console.log("Connect Your Account to Continue!")
            return []
        }
        const tx = await this.contract.functions.getApplication(id)
        return tx[0]
    }

    async getApplicationByAddress() {
        if (!this.isConnected) {
            console.log("Connect Your Account to Continue!")
            return []
        }

        const tx = await this.contract.functions.getApplicationsMadeByAddress()
        return tx[0]
    }
    async getAllApplicationsID() {
        if (!this.isConnected) {
            console.log("Connect Your Account to Continue!")
            return []
        }

        const tx = await this.contract.functions.getAllApplicationsID()
        return tx[0]
    }

    async voteReport(id) {
        if (!this.isConnected) {
            console.log("Connect Your Account to Continue!")
            return []
        }
        const options = { value: ethers.utils.parseUnits("1", 'ether').toHexString() }
        const tx = await this.contract.functions.addUpvote(id, 1, options)
        const receipt = await tx.wait();
        console.log(receipt);
    }

    async getBalance() {
        if (!this.isConnected) {
            console.log("Connect Your Account to Continue!")
            return []
        }
        const tx = await this.contract.functions.getBalance()
        // const receipt = await tx.wait();
        // console.log(receipt);
        return tx[0]
    }

    async withdraw() {
        if (!this.isConnected) {
            console.log("Connect Your Account to Continue!")
            return []
        }
        const tx = await this.contract.functions.withdraw()
        const receipt = await tx.wait();
        console.log(receipt);
    }

}