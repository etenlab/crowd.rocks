import { Injectable } from "@nestjs/common"
import { Config } from "apollo-server-core"
import { readFileSync } from "fs"
import { justBearerHeader } from "src/common/utility"
import { RegisterResolver } from "src/components/authentication/register.resolver"
import { ConfigService } from "./config.service"
import { PostgresService } from "./postgres.service"
import { SesService } from "./ses.service"

@Injectable()
export class DatabaseVersionControlService { 
  constructor(
    private pg: PostgresService,
    private ses: SesService,
    private config: ConfigService,
  ) {
    console.log("Database Version Control")
    this.init()
  }

  async init() {
    const exists = await this.getIsDbInit()

    if (exists) {
      const version = await this.getSchemaVersion()
      console.log('Database schema version:', version)
    } else {
      console.log("Creating database schema")
      await this.loadSchemaAndFunctions()
    }

    console.log('Database version check complete')
  }

  async getIsDbInit(): Promise<boolean> {
    const res = await this.pg.pool.query(`
      SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE  table_name   = 'database_version_control');
    `, [])

    return res.rows[0].exists
  }
 
  async getSchemaVersion(): Promise<number> {
    const res = await this.pg.pool.query(`
      select version 
      from database_version_control 
      order by version 
      desc limit 1;
    `, [])

    const version = res.rows[0].version 

    if (version) {
      return version
    }

    return 0
  }

  async loadSchemaAndFunctions() { 
    // schema
    await this.runSqlFile('./src/core/sql/schema/v1.schema.sql')

    // authentication
    await this.runSqlFile('./src/core/sql/authentication/password_reset.sql')
    await this.runSqlFile('./src/core/sql/authentication/register.sql')

    // user
    await this.runSqlFile('./src/core/sql/user/avatar_update.sql')

    // email
    await this.runSqlFile('./src/core/sql/email/verify_email.sql')

    // post  
    await this.runSqlFile('./src/core/sql/post/post_create.sql')
    await this.runSqlFile('./src/core/sql/post/version_create.sql')

    // update db version
    await this.setVersionNumber(1)

    await this.registerUser("michael@crowd.rocks", "Michael", "asdfasdf")
  } 

  async registerUser(email: string, avatar: string, password: string){
    const registerService = new RegisterResolver(this.pg, this.ses, this.config)
    await registerService.register({
      email,
      avatar,
      password,
    }, 
      justBearerHeader("michaelwuzhere")
    )
  }

  async setVersionNumber(version: number) {
    const res = await this.pg.pool.query(`
      insert into database_version_control(version) values($1);
    `, [version])
  }

  async runSqlFile(path: string) {
    console.log('loading SQL:', path)
    const data = readFileSync(path, 'utf8');
    const res = await this.pg.pool.query(data, [])
  }
}