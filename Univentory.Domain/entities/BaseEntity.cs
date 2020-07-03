﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Univentory.Domain.entities
{
    public class BaseEntity
    {
        public int Id { get; set; }

        public int CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
