FROM openfoam/openfoam6-graphical-apps
USER root
SHELL ["/bin/bash", "-c"]
RUN curl -sL https://deb.nodesource.com/setup_17.x | bash -
RUN apt-get install -y gcc g++ make nodejs
RUN npm update --location=global npm

COPY utils /app/utils
WORKDIR /app
RUN apt-get update && apt-get install -y git && apt-get clean &&\
    git config --global http.sslverify false &&\
    sed -i 's@^\[ "\$BASH" -o "\$ZSH_NAME" \] \&\& \\@#\[ "\$BASH" -o "\$ZSH_NAME" \] \&\& \\@g' /opt/openfoam6/etc/bashrc &&\
    sed -i 's@\$HOME@/home/openfoam@g' /opt/openfoam6/etc/bashrc
RUN sh utils/compile_solvers.sh

WORKDIR /app/openfoam_cbp