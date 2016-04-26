## Camicroscope Viewer Container



* `git clone https://lastlegion@bitbucket.org/lastlegion/camic_viewer_docker.git`

** Make sure you're running the following commands from the directory that has `DockerFile` ** i.e. the root of the repository.

* ` docker build -t camicroscope_viewer .`

*  ` docker run -itd -p 80:80 -v $(pwd)/html:/var/www/html -v <IMAGE_DIRECTORY>:/data/images camicroscope_viewer `

The `<IMAGE_DIRECTORY>` is the same directory that you used for Camicroscope DataLoader(https://hub.docker.com/r/lastlegion/dataloader/)


### Linking the viewer to dataloader

* Open `html/camicroscope/api/Configuration` 
* Change `$baseURL="<DATALOADER_CONTAINER_IP>:9099"`
