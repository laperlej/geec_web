import sys
import json

def main(json_path, missing_list):
    json_content = json.load(open(json_path))
    missing = {line.strip():None for line in open(missing_list)}
    new_json_content = {"datasets":[]}
    for dataset in json_content["datasets"]:
        if dataset["md5sum"] not in missing:
            new_json_content["datasets"].append(dataset)
    
    print json.dumps(new_json_content)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])