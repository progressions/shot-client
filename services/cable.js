import { createConsumer } from "@rails/actioncable"
import Api from "@/utils/Api"

const api = new Api()

console.log("api.cable()", api.cable())

const consumer = createConsumer(api.cable())
export default consumer
