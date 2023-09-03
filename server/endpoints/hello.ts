import {CrudEndpoints} from "../interfaces/crud-endpoints";
import {hello} from "../lib/helloworld";

const methods: CrudEndpoints<any> = {
    read: (req, res) => res.send({message: hello((req.query as any)?.name)})
}
export default methods;