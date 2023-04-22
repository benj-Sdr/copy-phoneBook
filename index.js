const express = require('express')
const app = express()

//import phone-book
let pBook = require('./phone.js')

const cors = require('cors')
//Morgan middleware
const morgan = require('morgan')

const dotenv = require('dotenv')
dotenv.config();

app.use(cors())
//app.use(morgan())
app.use(morgan('tiny'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));

//Serve static files
app.use(express.static('dist'))

//To recieve data need express.json()
app.use(express.json())

//Middleware to be used

morgan.token('content', (request) =>
  request.method === 'POST' && request.body.name
    ? JSON.stringify(request.body)
    : null
)


//morgan check
app.get('/', (req, res) => {
    console.log(morgan('tiny'))
   
})

//Exercise 3.1
app.get('/api/persons', (req, res) => {
    //console.log(morgan('tiny'))
    res.json(pBook)
})
//Exercise 3.2
app.get('/info', (req, res) => {
    let d = new Date()

    // res.send(`The phonebook has ${pBook.length - 1} users`)
    res.send(`
      <div>
          <p>The phonebook has ${pBook.length - 1} users</p>
          <p>${d}</p>
      </div>   
   `)
})

//Exercise 3.3 fetching a resource
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = pBook.find(person => {
        return person.id === id
    })

    if (person) {
        res.json(person)
    }
    else {
        res.status(404).end()
    }
})
//Exercise 3.4 delete a resource
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = pBook.filter(person => {
        return person.id !== id
    })
    if (person) {
        res.status(204).end()
    }
})
//Excercise 3.5
function getId() {
    return Math.floor(Math.random() * 1000)
}

//POST Request

app.post('/api/persons', (req, res) => {
    let body = req.body
    if (!body.name || !body.number) {
    
        return res.status(404).json({
            Error: 'number or phone is missing'
        })
    }
    else {
        let filterName = pBook.find(item => item.name === body.name)
        if (typeof filterName === 'undefined') {
            //console.log('The name does not exist')

            let person = {
                id: getId(),
                "name": body.name,
                "number": body.number
            }
            /* pBook.concat(person)
             console.log(pBook)
             res.json(person)*/
            let newPbook = [...pBook]
            pBook.concat(person)
            //newPbook.push(person)
        }
        else {
            res.status(409).json({
                error: 'name must be unique'
            })
        }
    }
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`The app is listening at port ${port}`)
})