import fs from 'fs-extra';
import yaml from 'yaml';

const configFile = fs.readFileSync('config.yml', 'utf8');
const config = yaml.parse(configFile);

export default config;
