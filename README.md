# CubingZA-comp-reg
Tool for managing registrations for WCA competitions in South Africa.

It pulls competition registration information from the World Cube Association API, and Quicket ticket sales from the Quicket API, then matches WCA registrations to payments, and displays a summary of:
  - *Pending*: people who have registered and paid, and are ready to be approved from the waiting list.
  - *Awaiting payment*: people who are on the WCA waiting list, but have not yet paid.
  - *Not yet registered*: people who have purchased a ticket but are not registered on the WCA website.
  - *Accepted but no payment matched*: people who have been accepted, but are not matched to a payment. Delegates and organisers are excluded from this list.
  - *Accepted*: people who have been accepted and matched to a payment.
  - *Deleted*: people who have had their registration deleted, regardless of whether they have paid or not.

### Running

After cloning the repository, install all dependencies:

```
npm install
```

Then create a local environment file by copying the `env.sample` file to `env.development` and editing the file to include your own API keys and client ID as appropriate.

Run a local development version by running:
```
npm start
```

You can then access the application in your browser at `http://localhost:1234`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)