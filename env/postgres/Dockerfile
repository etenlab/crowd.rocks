FROM postgres:15.3 

ENV PG_MAJOR 15

# Install the postgresql debugger
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  postgresql-$PG_MAJOR-pldebugger \
  mc

COPY ./postgresql.conf /etc/postgresql.conf
CMD [ "postgres", "-c", "log_statement=all", "-c", "config_file=/etc/postgresql.conf" ]

EXPOSE 5432
