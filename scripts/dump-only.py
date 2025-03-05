import subprocess
from pathlib import Path
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('DatabaseBackup')

def dump_database(db_user, db_password, container_name, db_name):
    try:
        now = datetime.now()
        date_folder = now.strftime('%Y-%m-%d')
        timestamp = now.strftime('%Y%m%d_%H%M%S')
        
        current_dir = Path(__file__).parent.resolve()
        backup_dir = current_dir / 'backups' / date_folder
        output_file = backup_dir / f'{db_name}_{timestamp}_data.sql'

        print(f"Creating backup directory: {backup_dir}")
        backup_dir.mkdir(parents=True, exist_ok=True)

        command = [
            'docker', 'exec',
            '-e', f'PGPASSWORD={db_password}',
            container_name,
            'pg_dump',
            '-v',
            '--data-only',  
            '--column-inserts',  
            '--disable-triggers',  
            '-U', db_user,
            '-d', db_name
        ]

        print(f"Executing dump command...")

        with open(output_file, 'wb') as f:
            process = subprocess.Popen(
                command,
                stdout=f,
                stderr=subprocess.PIPE,
                bufsize=10 * 1024 * 1024
            )
            
            _, stderr = process.communicate()

            if process.returncode != 0:
                print(f"Error in stderr: {stderr.decode()}")
                raise Exception(f"Command failed with return code {process.returncode}")
            
            if stderr:
                print(f"Messages from stderr: {stderr.decode()}")

        if output_file.exists():
            file_size = output_file.stat().st_size
            print(f'Data dump completed successfully.')
            print(f'File location: {output_file}')
            print(f'File size: {file_size / 1024 / 1024:.2f} MB')
            
            return str(output_file)
        else:
            raise Exception(f"File was not created at {output_file}")

    except Exception as e:
        print(f"Failed to dump database: {str(e)}")
        raise

def main(db_user, db_password, container_name, db_name):
    try:
        dump_result = dump_database(db_user, db_password, container_name, db_name)
        if dump_result:
            logger.info("Backup completed successfully!")
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        exit(1)

if __name__ == "__main__":
    DB_USER = "postgres"
    DB_PASSWORD = "postgres"
    CONTAINER_NAME = "postgres-5439-tracy"
    DB_NAME = "db2"
    
    main(DB_USER, DB_PASSWORD, CONTAINER_NAME, DB_NAME)
