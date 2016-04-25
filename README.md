

* Git `git clone https://lastlegion@bitbucket.org/lastlegion/camic_viewer_docker.git`

* Build the container
` docker build -t camicroscope_viewer .`

* Run the container 
` docker run -itd -p 80:80 -v $(pwd)/html:/var/www/html -v <IMAGE_DIRECTORY>:<IMAGE_DIRECTORY> camicroscope_viewer `

Make sure the `<IMAGE_DIRECTORY>` is the same that you used for Camicroscope DataLoader(https://hub.docker.com/r/lastlegion/dataloader/)