/*
When creating this infrastructure for the first time you will have to remove the azurerm backend block
*/

terraform {
  required_version = ">= 1.0.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.116.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 3.1.0"
    }
  }
#  backend "azurerm" {
#    storage_account_name = "stffktf"
#    resource_group_name  = "rg-terraform"
#    container_name       = "terraform"
#    key                  = "terraform.tfstate"
#  }
}

provider "azurerm" {
  subscription_id = "e608fd59-f3db-4b75-9dfb-ba60889b45f3"
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }

    log_analytics_workspace {
      permanently_delete_on_destroy = true
    }
  }
}