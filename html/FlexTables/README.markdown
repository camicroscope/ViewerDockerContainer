# Flex Tables

Event driven tables rendering data from REST APIs.


## Installation
**Requirements**

* Install php-apc package. For ubuntu: ``sudo apt-get install php-apc``

**Deployment**

* Add the project to your apache ``www`` directory.
* Run ```http://localhost/flextables``` from your browser

## Usage
The tool uses ``config.json`` file which resides in the root of the application to render tables.
Following is an example:

```
{
  "apiKey" : "",
  "title": "TCIA",
  "description": "Lorem ipsum dolor....",
  "path":[
    {
      "name": "Collections",
      "dataUrl": "http://localhost:3001/collections",
      "metadataUrl": "https://services.cancerimagingarchive.net/services/v3/TCIA/query/getCollectionValues/metadata"
    },
    {
      "name": "Patients",
      "dataUrl": "http://localhost:3001/patients",
      "params": ["Collection"] 
    },
    {
      "name": "PatientStudy",
      "dataUrl": "http://localhost:3001/patientStudy",
      "params": ["PatientID", "Collection"]
    },

    {
      "name": "Link",
      "type": "link",
      "params": [{
        "name": "xyz",
        "value": "StudyInstanceUID"
      }],
      "url": "http://example.com"
    }
  ]
}
```

* ``\apiKey`` *string* API Key used for connecting to the REST API.
* ``\title`` *string*  Rendered on the top-right corner of the app-bar.
* ``\description`` *string* Brief description of the app.
* ``\path`` *array* an **ordered** array of nodes that describe the path.
* ``\path\n\name`` *string* Name of the node(Rendered on the app).
* ``\path\n\type`` *string* *optional* Used to specify links.
* ``\path\n\dataUrl`` *string* Endpoint of the REST API.(Donot include trailing slash)
* ``\path\n\params`` *array* Specify parameters used with the dataUrl