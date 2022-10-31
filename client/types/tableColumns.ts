import { UserPurchase } from './requests'

const columns = [
  {
    name: 'Product ID',
    selector: (row: UserPurchase) => row.productId,
    sortable: true,
  },
  {
    name: 'User Email',
    selector: (row: UserPurchase) => row.email,
    sortable: true,
  },
  {
    name: 'User Phone',
    selector: (row: UserPurchase) => row.phone,
    sortable: true,
  },
  {
    name: 'numOfParticiapants',
    selector: (row: UserPurchase) => row.phone,
    sortable: true,
  },
]
